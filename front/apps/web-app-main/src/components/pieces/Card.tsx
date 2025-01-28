import Big from 'big.js';

import styles from './styles/card.module.scss';
import { Account } from '@ledget/shared-features';
import { InstitutionLogo } from '@components/pieces';
import React from 'react';
import { useColorScheme, DollarCents, PulseDiv } from '@ledget/ui';

const Card = ({
  card,
  width,
  height,
}: {
  card?: Account;
  width: number;
  height: number;
}) => {
  const { isDark } = useColorScheme();
  return !card ? (
    <SkeletonCard width={width} height={height} />
  ) : (
    <div
      className={styles.card}
      data-light={!isDark}
      data-custom-hue={Boolean(card.card_hue)}
      style={
        {
          '--card-hue': `${card.card_hue}`,
          '--card-width': `${width}px`,
          '--card-height': `${height}px`,
          backgroundColor: `hsl(${card.card_hue}, 100%, 100%` || 'var(--blue)',
        } as React.CSSProperties
      }
    >
      {/* chip */}
      <span
        className={styles.chip}
        data-light={!isDark}
        data-custom-hue={Boolean(card.card_hue)}
      />
      <h3>
        <DollarCents value={Big(card.balances.current).times(100).toNumber()} />
      </h3>
      <div className={styles.name} data-light={!isDark}>
        <span>
          {card.name.length > 20 ? `${card.name.slice(0, 20)}...` : card.name}
        </span>
      </div>
      <div className={styles.mask} data-light={!isDark}>
        <span>
          &nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull; &nbsp;&nbsp;
          &bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull; &nbsp;&nbsp;
        </span>
        <span>{card.mask}</span>
      </div>
      <div className={styles.logo} data-light={!isDark}>
        <InstitutionLogo accountId={card.id} size={'1.5em'} />
      </div>
    </div>
  );
};

const SkeletonCard = ({ width, height }: { width: number; height: number }) => (
  <div
    className={styles.card}
    data-skeleton={true}
    style={
      {
        '--card-width': `${width}px`,
        '--card-height': `${height}px`,
      } as React.CSSProperties
    }
  >
    <PulseDiv isSkeleton={true} />
  </div>
);

export default Card;
