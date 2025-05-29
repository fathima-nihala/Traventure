import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { User, CalendarCheck, Package } from 'lucide-react';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../../../redux/slices/authSlice';
import { useEffect, useMemo } from 'react';
import UserImg from '../../../assets/user.png';
import { getBookingAnalytics } from '../../../redux/slices/bookingSlice';
import { getPackages } from '../../../redux/slices/packageSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashHome = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { clients, isLoading } = useSelector((state: RootState) => state.auth);
  const { analytics } = useSelector((state: RootState) => state.booking);
  const { packages } = useSelector((state: RootState) => state.package);

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getBookingAnalytics());
    dispatch(getPackages({}));
  }, [dispatch]);

  const cards = [
    { title: 'Total Users', count: clients.length || 0, icon: <User className="w-8 h-8 text-blue-500" /> },
    { title: 'Total Bookings', count: analytics?.totalBookings, icon: <CalendarCheck className="w-8 h-8 text-green-500" /> },
    { title: 'Total Packages', count: packages?.length, icon: <Package className="w-8 h-8 text-purple-500" /> },
  ];

  // Generate chart data based on package creation dates
  const chartData = useMemo(() => {
    if (!packages || packages.length === 0) {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Packages Created',
            data: [0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
          },
        ],
      };
    }

    // Group packages by month
    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);

    packages.forEach(pkg => {
      if (pkg.createdAt) {
        const createdDate = new Date(pkg.createdAt);
        if (createdDate.getFullYear() === currentYear) {
          const month = createdDate.getMonth();
          monthCounts[month]++;
        }
      }
    });

    // Calculate cumulative counts for better visualization
    const cumulativeCounts = [];
    let total = 0;
    for (let i = 0; i < 12; i++) {
      total += monthCounts[i];
      cumulativeCounts.push(total);
    }

    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Total Packages',
          data: cumulativeCounts,
          fill: false,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Monthly New Packages',
          data: monthCounts,
          fill: false,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [packages]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Package Creation Analytics' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
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
                    <tr key={user?._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        <img
                          src={user?.profilePicture || UserImg}
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