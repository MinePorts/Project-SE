import { useCallback, useEffect, useState } from "react";
import Lodash from "lodash";
import Axios from "axios";
import { message } from "antd";
import Qs from "qs";
import { useRouter } from "next/navigation";

interface Config {
    getApi: string;
    checkApi: string;
}

interface State {
    popoverVisible: boolean;
    type?: "success" | "error";
}

interface Data {
    image: string;
    thumb: string;
    captKey: string;
}

interface Dot {
    x: number;
    y: number;
}

export const useClickHandler = (config: Config) => {
    const [state, setState] = useState<State>({ popoverVisible: false });
    const [data, setData] = useState<Data>({
        image: "",
        thumb: "",
        captKey: "",
    });
    const Router = useRouter();

    const clickEvent = useCallback(() => {
        setState((prevState) => ({ ...prevState, popoverVisible: true }));
    }, []);

    const visibleChangeEvent = useCallback((visible: boolean) => {
        setState((prevState) => ({ ...prevState, popoverVisible: visible }));
    }, []);

    const closeEvent = useCallback(() => {
        setState((prevState) => ({ ...prevState, popoverVisible: false }));
    }, []);

    const requestCaptchaData = useCallback(() => {
        Axios({
            method: "get",
            url: config.getApi,
        })
            .then((response) => {
                const { data = {} } = response;
                if ((data["code"] || 0) === 0) {
                    if (Lodash.isEmpty(data)) {
                        return;
                    }
                    setData({
                        image: data["image_base64"] || "",
                        thumb: data["thumb_base64"] || "",
                        captKey: data["captcha_key"] || "",
                    });
                } else {
                    message.warning(`failed get captcha data`);
                }
            })
            .catch((e) => {
                console.warn(e);
            });
    }, [config.getApi]);

    const refreshEvent = useCallback(() => {
        requestCaptchaData();
    }, [requestCaptchaData]);

    const confirmEvent = useCallback(
        (dots: Dot[], clear: () => void) => {
            const dotArr: number[] = [];
            dots.forEach((item: Dot) => {
                dotArr.push(item.x, item.y);
            });
            Axios({
                method: "post",
                url: config.checkApi,
                data: Qs.stringify({
                    dots: dotArr.join(","),
                    key: data.captKey || "",
                }),
            })
                .then((response) => {
                    const { data = {} } = response;
                    if ((data["code"] || 0) === 0) {
                        message.success(`check captcha data success`);
                        setState((prevState) => ({
                            ...prevState,
                            popoverVisible: false,
                            type: "success",
                        }));
                        Router.push(`/pages/profile`);
                    } else {
                        message.warning(
                            `failed check captcha data, please try again`
                        );
                        setState((prevState) => ({
                            ...prevState,
                            type: "error",
                        }));
                    }

                    setTimeout(() => {
                        clear();
                        requestCaptchaData();
                    }, 1000);
                })
                .catch((e) => {
                    console.warn(e);
                });
        },
        [data.captKey, config.checkApi, requestCaptchaData]
    );

    useEffect(() => {
        if (state.popoverVisible) {
            requestCaptchaData();
        }
    }, [state.popoverVisible, requestCaptchaData]);

    return {
        state,
        data,
        visibleChangeEvent,
        clickEvent,
        closeEvent,
        refreshEvent,
        confirmEvent,
    };
};
