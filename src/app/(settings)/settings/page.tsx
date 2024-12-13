import UsersTable from "@/Components/Settings/Users/UsersTable";

export default function Settings() {
  return (
    <div>
      <div className="container mx-auto mt-2 p-1">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <div className="mt-5">
          <div role="tablist" className="tabs tabs-lifted">
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Users"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <UsersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
