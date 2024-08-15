import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
    return (
        <div className="vh-100 vw-100 z-1 position-absolute d-flex justify-content-center align-items-center opacity-25 bg-dark">
            <BeatLoader
                color="blue"
                size="25px"
            />
        </div>
    )
}

export default Loader
