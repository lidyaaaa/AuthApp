export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Content */}
      <main className="flex-grow-1 p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-auto">
        &copy; {new Date().getFullYear()} My App. All rights reserved.
      </footer>
    </div>
  );
}
