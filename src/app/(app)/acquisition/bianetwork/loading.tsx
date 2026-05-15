import { LoaderBrand } from '@biaenergy/ui';

// Loader bajo los tabs cuando se navega entre Usuarios / Usuarios Pro /
// Cuentas / etc. El layout de bianetwork mantiene `<BiaNetworkTabs />` y
// reemplaza solo el `{children}` con este loading boundary, así la tabs
// strip de arriba no se reinicia y el efecto es "tab seleccionado → loader
// debajo".
const BiaNetworkLoading = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <LoaderBrand.Pill size="md" />
  </div>
);

export default BiaNetworkLoading;
