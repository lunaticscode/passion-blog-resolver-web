import { pageCls } from "../consts/className";

const SigninPage = () => {
  const handleClickGoogleOauth = () => {
    window.location.href = "http://localhost:8080/api/oauth/google";
  };
  return (
    <div className={`signin-${pageCls}`}>
      <div className="signin-container">
        <h2 style={{ fontWeight: "bold" }}>LOGO</h2>
        <button onClick={handleClickGoogleOauth} className="google-login">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          <span>Google 로그인</span>
        </button>
      </div>
    </div>
  );
};
export default SigninPage;
