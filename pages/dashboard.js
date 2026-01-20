import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0">Dashboard</h2>
          <small className="text-muted">
            Welcome back, {session.user.email}
          </small>
        </div>

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
            style={{ width: 48, height: 48 }}
          >
            👤
          </div>

          <div>
            <h6 className="mb-1 fw-semibold">Profile Information</h6>
            <small className="text-muted d-block">
              Email: {session.user.email}
            </small>
            <small className="text-muted">
              Role: <span className="fw-semibold">{session.user.role}</span>
            </small>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Total Login</small>
              <h3 className="fw-bold mt-2">12</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Status</small>
              <h3 className="fw-bold mt-2 text-success">Active</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Role</small>
              <h3 className="fw-bold mt-2 text-capitalize">
                {session.user.role}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Action */}
      {session.user.role === "admin" && (
        <div className="text-end">
          <a href="/admin/users" className="btn btn-primary">
            Manage Users
          </a>
        </div>
      )}
    </div>
  );
}
