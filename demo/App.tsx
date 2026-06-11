import { CRM } from "@/components/atomic-crm/root/CRM";
import {
  authProvider,
  dataProvider,
} from "@/components/atomic-crm/providers/fakerest";
import { memoryStore } from "ra-core";

const App = () => (
  <CRM
    title="Maison Tanneurs"
    lightModeLogo="./logos/mt-logo-light.png"
    darkModeLogo="./logos/mt-logo-dark.png"
    dataProvider={dataProvider}
    authProvider={authProvider}
    store={memoryStore()}
  />
);

export default App;
