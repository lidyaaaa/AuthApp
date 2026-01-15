import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (session?.user.role === "admin") {
      fetch("/api/admin/users")
        .then(res => res.json())
        .then(setUsers);
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin")
    return <p>Akses ditolak</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin – User Management</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    await fetch("/api/admin/users", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: user.id }),
                    });

                    setUsers(users.filter(u => u.id !== user.id));
                  }}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
