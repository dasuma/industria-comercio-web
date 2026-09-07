import Link from 'next/link';
import { Badge, Table } from '@dasuma/pradma-ui';
import {
  RiArrowRightLine,
  RiCalculatorLine,
  RiCoinsLine,
  RiInformationLine
} from '@dasuma/pradma-ui/icons';
import { getPublicDiscountsByYear } from '@modules/pradma';
import { PortalChrome } from './PortalChrome';
import { PortalLoginForm } from './PortalLoginForm';

const formatDate = (dateStr: string): string =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

const currentYear = new Date().getFullYear();
const taxYear = currentYear - 1;

const PortalPage = async () => {
  let discounts: Awaited<ReturnType<typeof getPublicDiscountsByYear>> = [];

  try {
    discounts = await getPublicDiscountsByYear(taxYear);
  } catch {
    // Si el backend no está disponible, se muestra la tabla vacía
  }

  return (
    <PortalChrome
      maxWidth="max-w-5xl"
      headerRight={
        <Badge.Root variant="light" color="blue">
          Año gravable {taxYear}
        </Badge.Root>
      }
    >
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left — Login */}
        <div className="w-full shrink-0 lg:w-80">
          <PortalLoginForm />
        </div>

        {/* Right — ICA Discounts */}
        <div className="bg-bg-white-0 ring-stroke-soft-200 flex-1 overflow-hidden rounded-2xl ring-1">
          <div className="border-stroke-soft-200 flex items-center gap-2 border-b px-6 py-5">
            <div className="bg-bg-weak-50 text-text-sub-600 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <RiCoinsLine className="size-4" />
            </div>
            <div>
              <h2 className="text-text-strong-950 text-label-sm">
                Impuesto de Industria y Comercio (I.C.A)
              </h2>
              <p className="text-text-sub-600 text-paragraph-xs">
                Descuentos por pronto pago vigentes para el año gravable {taxYear}
              </p>
            </div>
          </div>

          {discounts.length === 0 ? (
            <div className="text-text-soft-400 flex flex-col items-center gap-2 px-6 py-14">
              <RiInformationLine className="size-8" />
              <p className="text-paragraph-sm">
                No hay descuentos disponibles para el año {taxYear}.
              </p>
            </div>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Beneficio tributario</Table.Head>
                  <Table.Head>Detalle</Table.Head>
                  <Table.Head>Fecha límite de pago</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {discounts.map(discount => (
                  <Table.Row key={discount.id}>
                    <Table.Cell>Descuento por pago oportuno</Table.Cell>
                    <Table.Cell>
                      <Badge.Root variant="light" color="green">
                        {discount.percentage}% de descuento
                      </Badge.Root>
                    </Table.Cell>
                    <Table.Cell>{formatDate(discount.endDate)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}

          <div className="border-stroke-soft-200 text-text-soft-400 text-paragraph-xs border-t px-6 py-4">
            Los descuentos aplican sobre el valor liquidado del impuesto ICA, previa presentación
            oportuna de la declaración.
          </div>
        </div>
      </div>

      {/* ── Simulator CTA ── */}
      <Link
        href="/portal/simular"
        className="bg-bg-white-0 ring-stroke-soft-200 hover:ring-stroke-strong-950 flex w-full items-center gap-4 rounded-2xl px-6 py-4 ring-1 transition-[box-shadow,--tw-ring-color]"
      >
        <div className="bg-bg-weak-50 text-text-sub-600 flex size-10 shrink-0 items-center justify-center rounded-xl">
          <RiCalculatorLine className="size-5" />
        </div>
        <div className="flex-1">
          <p className="text-text-strong-950 text-label-sm">Simulador de Liquidación ICA</p>
          <p className="text-text-sub-600 text-paragraph-xs">
            Estimá el valor de tu impuesto antes de declarar — sin necesidad de ingresar
          </p>
        </div>
        <RiArrowRightLine className="text-text-soft-400 size-5 shrink-0" />
      </Link>
    </PortalChrome>
  );
};

export default PortalPage;
