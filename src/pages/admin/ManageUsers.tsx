// ============================================================
// Funnel Builders — Manage Users Page (Admin)
// ============================================================

import { useState, useEffect } from 'react';
import * as usersApi from '../../api/users';
import type { User } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.getUsers({ page });
      setUsers(res.results);
      setTotalCount(res.count);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'STUDENT' ? 'INSTRUCTOR' : 'STUDENT';
    if (window.confirm(`Voulez-vous vraiment changer le rôle de cet utilisateur en ${newRole} ?`)) {
      try {
        await usersApi.updateUser(userId, { role: newRole });
        loadUsers();
      } catch (err) {
        alert("Erreur lors de la modification du rôle.");
      }
    }
  };

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1 className="admin-content__title">Utilisateurs</h1>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            {totalCount} utilisateur{totalCount !== 1 ? 's' : ''} au total
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Rôle</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                  <Loader />
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Badge variant={
                      user.role === 'ADMIN' ? 'warning' :
                      user.role === 'INSTRUCTOR' ? 'primary' : 'info'
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                      {user.role !== 'ADMIN' && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleRoleChange(user.id, user.role)}
                        >
                          {user.role === 'STUDENT' ? 'Promouvoir Formateur' : 'Rétrograder Étudiant'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-tertiary)' }}>
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalCount > 10 && (
        <Pagination
          currentPage={page}
          totalItems={totalCount}
          onPageChange={setPage}
          nextUrl={nextUrl}
          previousUrl={prevUrl}
        />
      )}
    </>
  );
}
