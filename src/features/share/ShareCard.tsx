import {palette} from '@/styles/palette';

// Drawn by Satori for link previews, so styles are inline and limited to its CSS subset.
export const shareCardSize = {width: 1200, height: 630};

export const ShareCard = ({name, role, arms}: {name: string; role: string; arms: string}) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      padding: 28,
      background: palette.bg.dark,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 72,
        width: '100%',
        height: '100%',
        padding: '0 88px',
        border: `2px solid ${palette.accent.dark}`,
        borderRadius: 6,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 28, flex: 1}}>
        <div style={{fontSize: 80, fontWeight: 600, lineHeight: 1.1, color: palette.fg.dark}}>
          {name}
        </div>
        <div style={{width: 120, height: 3, background: palette.accent.dark}} />
        <div
          style={{
            fontSize: 38,
            fontWeight: 500,
            lineHeight: 1.3,
            textWrap: 'balance',
            color: palette.fgMuted.dark,
          }}
        >
          {role}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws plain <img> only */}
      <img src={arms} alt="" width={353} height={403} />
    </div>
  </div>
);
