import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { User, CalendarCheck, Package } from 'lucide-react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../../../redux/slices/authSlice';
import { useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashHome = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { clients, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);


  const cards = [
    { title: 'Total Users', count: clients.length || 0, icon: <User className="w-8 h-8 text-blue-500" /> },
    { title: 'Total Bookings', count: 350, icon: <CalendarCheck className="w-8 h-8 text-green-500" /> },
    { title: 'Total Packages', count: 45, icon: <Package className="w-8 h-8 text-purple-500" /> },
  ];

  // const userList = [
  //   { id: 1, name: 'John Doe', email: 'john@example.com', image: 'https://i.pravatar.cc/150?img=1' },
  //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', image: 'https://i.pravatar.cc/150?img=2' },
  //   { id: 3, name: 'Mike Johnson', email: 'mike@example.com', image: 'https://i.pravatar.cc/150?img=3' },
  // ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [100, 200, 400, 600, 800, 1200],
        fill: false,
        borderColor: '#2563EB',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'User Growth Over Months' },
    },
  };

  return (
    <div className="p-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5 flex flex-col items-center text-center">
            <div className="mb-3">
              {card.icon}
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">{card.count}</h2>
            <p className="text-gray-500">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Table Section */}
      {/* <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Users</h2>
        {isLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">No.</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  {/* <th className="p-3">Role</th> */}
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((user, index) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {/* <img
                          src={user?.profilePicture || "/placeholder-user.png"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-user.png";
                          }}
                        /> */}
                        <img
                          src={user?.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      {/* <td className="p-3">{user.role}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashHome;
