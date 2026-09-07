import Link from 'next/link';
import { RiArrowLeftSLine } from '@dasuma/pradma-ui/icons';
import { PortalChrome } from '../PortalChrome';
import { PortalSimulator } from './PortalSimulator';

const currentYear = new Date().getFullYear();
const taxYear = currentYear - 1;

const SimularPage = () => (
  <PortalChrome
    maxWidth="max-w-3xl"
    headerRight={
      <Link
        href="/portal"
        className="text-text-sub-600 hover:text-text-strong-950 text-label-sm flex items-center gap-1 transition-colors"
      >
        <RiArrowLeftSLine className="size-4" />
        Volver al portal
      </Link>
    }
  >
    <div className="flex flex-col gap-1">
      <h1 className="text-text-strong-950 text-title-h5">Simulador de Liquidación ICA</h1>
      <p className="text-text-sub-600 text-paragraph-sm">
        Estimá el valor del impuesto de Industria y Comercio para el año gravable {taxYear}.
      </p>
    </div>
    <PortalSimulator />
  </PortalChrome>
);

export default SimularPage;
