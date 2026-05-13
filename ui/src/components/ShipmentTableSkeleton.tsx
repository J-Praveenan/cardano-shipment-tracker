export default function ShipmentTableSkeleton() {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <tr
          key={item}
          className="animate-pulse border-b border-gray-100"
        >
          <td className="px-6 py-6">
            <div className="h-5 w-24 rounded bg-gray-200"></div>
          </td>

          <td className="px-6 py-6">
            <div className="h-5 w-24 rounded bg-gray-200"></div>
          </td>

          <td className="px-6 py-6">
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-gray-200"></div>
            </div>
          </td>

          <td className="px-6 py-6">
            <div className="h-5 w-16 rounded bg-gray-200"></div>
          </td>

          <td className="px-6 py-6">
            <div className="h-5 w-20 rounded bg-gray-200"></div>
          </td>

          <td className="px-6 py-6">
            <div className="h-8 w-24 rounded-full bg-gray-200"></div>
          </td>

          <td className="px-6 py-6">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200"></div>
            </div>
          </td>

          <td className="px-6 py-6">
            <div className="flex gap-2">
              <div className="h-9 w-16 rounded-lg bg-gray-200"></div>
              <div className="h-9 w-16 rounded-lg bg-gray-200"></div>
              <div className="h-9 w-16 rounded-lg bg-gray-200"></div>
              <div className="h-9 w-16 rounded-lg bg-gray-200"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}