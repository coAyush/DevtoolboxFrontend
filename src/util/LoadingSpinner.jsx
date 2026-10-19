import { ClipLoader } from "react-spinners";
const LoadingSpinner = ({ color, loading, size = 100, ariaLabel = "Loading Spinner", dataTestid = "loader" }) => {
    return (
        <ClipLoader
            color={color}
            loading={loading}
            size={size}
            aria-label={ariaLabel}
            data-testid={dataTestid}
        />
    )
}
export default LoadingSpinner;