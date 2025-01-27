import Big from 'big.js';

import styles from './styles/card.module.scss';
import { Account } from '@ledget/shared-features';
import { InstitutionLogo } from '@components/pieces';
import { cardWidth, cardHeight } from './constants';
import React from 'react';
import { useColorScheme, DollarCents } from '@ledget/ui';

const Card = ({ card }: { card: Account }) => {
  const { isDark } = useColorScheme();
  return (
    <div
      className={styles.card}
      data-light={!isDark}
      data-custom-hue={Boolean(card.card_hue)}
      style={
        {
          '--card-hue': `${card.card_hue}`,
          '--card-width': `${cardWidth}px`,
          '--card-height': `${cardHeight}px`,
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

export default Card;
