import useFetch from "../hooks/useFetch";

interface User {
  id: number;
  name: string;
}

const UserList = () => {
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    cancelFetch,
    refetch,
  } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users");

  const handleRefetch = () => {
    refetch();
  };

  const handleCancel = () => {
    cancelFetch();
  };

  const firstFiveUsers = users ? users.slice(0, 10) : [];
  return (
    <div className="text-center mt-10">
      <button
        onClick={handleRefetch}
        disabled={usersLoading}
        className={`px-4 py-2 rounded text-white text-lg bg-blue-500 cursor-pointer`}
      >
        Обновить данные пользователя
      </button>
      <button
        onClick={handleCancel}
        className={`px-4 py-2 rounded text-white text-lg bg-red-500 cursor-pointer`}
      >
        Отменить запрос
      </button>

      <ul className="w-[300px] mx-auto my-0 bg-neutral-50 rounded-2xl">
        <h1 className="text-2xl font-bold mt-4 mb-2">Список пользователей</h1>
        {firstFiveUsers.length > 0 ? (
          firstFiveUsers.map((user) => (
            <li key={user.id} className="mb-1">
              <strong>{user.name}</strong>
            </li>
          ))
        ) : (
          <p>Нет пользователей.</p>
        )}
      </ul>
      {usersLoading && <p>Загрузка пользователей...</p>}
      {usersError && <p>Ошибка загрузки пользователей: {usersError.message}</p>}
    </div>
  );
};
export default UserList;
