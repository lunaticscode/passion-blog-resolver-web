import { useNavigate } from "react-router-dom";
import { pageCls } from "../consts/className";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className={pageCls}>
      <h3>잘못된 경로의 페이지입니다.</h3>
      <button onClick={() => navigate("/")}>홈으로</button>
    </div>
  );
};
export default NotFoundPage;
