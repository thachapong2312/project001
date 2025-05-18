import "./error.css";

export default function Error() {
  return (
    <div className="error-page">
      <img
        className="error-img"
        src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800"
        alt="404 Not Found"
      />
      <div className="error-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="error-btn">Go Home</a>
      </div>
    </div>
  );
}
