import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>

        <button
          className="btn btn-outline-danger"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">👤 Profile</h5>

          <p className="mb-1">
            <strong>Email:</strong> {session.user.email}
          </p>

          <p className="mb-0">
            <strong>Role:</strong> {session.user.role}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card text-bg-primary shadow-sm">
            <div className="card-body">
              <h6>Total Login</h6>
              <h3>12</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success shadow-sm">
            <div className="card-body">
              <h6>Status</h6>
              <h3>Active</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-dark shadow-sm">
            <div className="card-body">
              <h6>Role</h6>
              <h3>{session.user.role}</h3>
            </div>
          </div>
        </div>
      </div>
      <a href="/admin/users" className="btn btn-primary">
        Manage Users
      </a>
    </div>
  );
}
