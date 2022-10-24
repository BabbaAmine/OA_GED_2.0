import { useNavigate,useLocation,useParams,useSearchParams } from 'react-router-dom';
import useWindowSize from "../../components/WindowSize/useWindowSize";
const withNavigate = Component => props => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const screenSize = useWindowSize()

    return <Component {...props} navigate={navigate} location={location} params={params} searchParams={searchParams} screenSize={screenSize} />;
};
export default withNavigate