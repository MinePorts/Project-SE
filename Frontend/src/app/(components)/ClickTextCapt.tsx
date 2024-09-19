"use client";
import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import GoCaptcha from "go-captcha-react";
import { useClickHandler } from "./Hooks/useClickText";

function ClickTextCapt() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const handler = useClickHandler({
        getApi: "http://localhost:5000/captcha",
        checkApi: "http://localhost:5000/verif",
    });

    if (!mounted) {
        return null;
    }

    return (
        <Popover
            content={
                <GoCaptcha.Click
                    config={{
                        width: 300,
                        height: 240,
                        showTheme: false,
                        verticalPadding: 5,
                        horizontalPadding: 5,
                    }}
                    data={handler.data}
                    events={{
                        close: handler.closeEvent,
                        refresh: handler.refreshEvent,
                        confirm: handler.confirmEvent,
                    }}
                />
            }
            open={handler.state.popoverVisible}
            onOpenChange={handler.visibleChangeEvent}
            forceRender={true}
            trigger="click"
        >
            <GoCaptcha.Button
                {...handler.state}
                clickEvent={handler.clickEvent}
                title={"Verification"}
            />
        </Popover>
    );
}

export default ClickTextCapt;
