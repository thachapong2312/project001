import "./header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleSm">Senior Project</span>
        <span className="headerTitleLg">ELECTRONIC AND TELECOMMUNICATION ENGINEERING</span>
      </div>
      <img
        className="headerImg"
        src="https://media.licdn.com/dms/image/v2/D4D1BAQFgmrYvlG-aaQ/company-background_10000/company-background_10000/0/1655321602795/kmutt_cover?e=2147483647&v=beta&t=-oBC43DFebWSfi26PzBXVd2M-mrynn-vsAZREoFTFBw"
        alt=""
      />
    </div>
  );
}