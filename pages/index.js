import Ubuntu from "../components/ubuntu";
import Meta from "../components/SEO/Meta";
import ProfileContent from "../components/SEO/ProfileContent";

function App() {
  return (
    <>
      <Meta />
      {/* Mobile: this is the site. Desktop: collapses to sr-only, crawlers still read it. */}
      <ProfileContent />
      {/* The tiling WM is desktop-only -- unusable below md. */}
      <div className="hidden md:block">
        <Ubuntu />
      </div>
    </>
  )
}

export default App;
