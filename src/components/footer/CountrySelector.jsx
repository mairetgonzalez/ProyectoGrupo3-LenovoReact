// 🇧🇷 Seletor de país com react-select (ES/US/BR)

import { useMemo, useState } from 'react';
import Select, { components as RSComponents } from 'react-select';

/**
 * ✅ Resolução de imagens estáticas com Vite/ESM
 * - `import.meta.url` é a URL ABSOLUTA do módulo atual (este arquivo).
 * - `new URL('caminho/relativo', import.meta.url).href` gera a URL final do asset.
 * - Isso evita problemas com caminhos relativos (../../...) e funciona bem em build.
 * - Use quando as imagens estão em `src/assets/...`.
 */
const flagES = new URL('../../assets/flags/flag-eeuu.png', import.meta.url).href;
const flagUS = new URL('../../assets/flags/flag-ingles.png', import.meta.url).href;
const flagBR = new URL('../../assets/flags/flag-portugues.png', import.meta.url).href;

/**
 * ► Opções do select
 * - Cada opção tem `value`, `label` e a URL da bandeira resolvida acima.
 */
const COUNTRY_OPTIONS = [
  { value: 'ES', label: 'ESPAÑA',         flag: flagES },
  { value: 'US', label: 'ESTADOS UNIDOS', flag: flagUS },
  { value: 'BR', label: 'BRASIL',         flag: flagBR },
];

/**
 * ► Custom Option
 * - Usa os subcomponentes do react-select para renderizar cada opção com ícone + texto.
 */
const Option = (props) => (
  <RSComponents.Option {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* `props.data.flag` contém a URL resolvida da imagem */}
      <img src={props.data.flag} alt="" width={18} height={18} />
      <span>{props.data.label}</span>
    </div>
  </RSComponents.Option>
);

/**
 * ► SingleValue (valor selecionado)
 * - Define como o valor ativo aparece no campo do select.
 */
const SingleValue = (props) => (
  <RSComponents.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={props.data.flag} alt="" width={18} height={18} />
      <span>{props.data.label}</span>
    </div>
  </RSComponents.SingleValue>
);

/**
 * ► Componente principal
 */
export default function CountrySelector() {
  // Estado controlando a opção selecionada (inicia com a primeira)
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);

  /**
   * ► Estilos do react-select via função (permite estilizar estados)
   * - `useMemo` previne recriar o objeto a cada render sem necessidade.
   */
  const styles = useMemo(() => ({
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      borderRadius: 12,
      borderColor: state.isFocused ? 'var(--lenovo-red)' : 'var(--lenovo-gray)',
      boxShadow: state.isFocused ? '0 0 0 1px var(--lenovo-red)' : 'none',
      '&:hover': { borderColor: 'var(--lenovo-red)' },
      backgroundColor: 'var(--white)',
    }),
    valueContainer: (b) => ({ ...b, padding: '6px 12px' }),
    placeholder: (b) => ({ ...b, color: 'var(--muted)' }),
    dropdownIndicator: (b) => ({ ...b, color: 'var(--black)' }),
    menu: (b) => ({ ...b, border: '1px solid var(--lenovo-gray)', borderRadius: 12, overflow: 'hidden', zIndex: 20 }),
    menuList: (b) => ({ ...b, maxHeight: 240 }),
    option: (b, s) => ({
      ...b,
      backgroundColor: s.isSelected
        ? 'rgba(225, 20, 10, 0.08)'
        : s.isFocused
        ? 'var(--lenovo-light-gray)'
        : 'var(--white)',
      color: 'var(--black)',
      padding: '10px 12px',
      cursor: 'pointer',
    }),
    singleValue: (b) => ({ ...b, color: 'var(--black)', fontWeight: 600 }),
  }), []);

  return (
    <div className="country-select-wrap">
      <label className="country-label" htmlFor="country-select">
        Selecionar País/Região:
      </label>

      {/* 
        Select controlado:
        - `options`: usa COUNTRY_OPTIONS com bandeiras resolvidas.
        - `value` / `onChange`: estado controlado pelo React.
        - `components`: injeta Option e SingleValue customizados.
        - `styles`: objeto de estilos customizado acima.
      */}
      <Select
        inputId="country-select"
        instanceId="country-select"
        options={COUNTRY_OPTIONS}
        value={country}
        onChange={setCountry}
        components={{ Option, SingleValue }}
        styles={styles}
        isSearchable
        menuPlacement="auto"
        placeholder="País"
      />
    </div>
  );
}

