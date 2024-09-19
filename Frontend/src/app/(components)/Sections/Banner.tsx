export function Banner(props: { src: string }) {
    return (
        <div className="py-6 max-w-6xl">
            <img src={props.src} alt="Banner" className="rounded-lg "/>
        </div>
    );
}
