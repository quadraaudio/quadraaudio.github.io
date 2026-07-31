import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "96px 24px", textAlign: "center" }}>
      <h1 className="display display-lg">Page not found</h1>
      <p className="lede" style={{ margin: "16px auto 24px" }}>
        The page you requested does not exist.
      </p>
      <Link href="/" className="btn btn-primary">
        Back home
      </Link>
    </main>
  );
}
