'use client'

import { useLocale } from '@/context/LocaleContext'
import styles from './Stack.module.css'

export default function StackTerminal() {
  const { t } = useLocale()
  const j = t.stack.terminal_json

  return (
    <div className={styles.terminal}>
      <div className={styles.termBar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.termTitle}>{t.stack.terminal_title}</span>
      </div>
      <div className={styles.termBody}>
        <div className={styles.termLine}>
          <span className={styles.prompt}>➜ </span>
          <span className={styles.cmd}>{t.stack.terminal_cmd}</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.comment}>{'{'}</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.indent} />
          <span className={styles.key}>{'"name"'}</span>
          <span className={styles.comment}>: </span>
          <span className={styles.str}>{`"${j.name}"`}</span>
          <span className={styles.comment}>,</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.indent} />
          <span className={styles.key}>{'"role"'}</span>
          <span className={styles.comment}>: </span>
          <span className={styles.str}>{`"${j.role}"`}</span>
          <span className={styles.comment}>,</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.indent} />
          <span className={styles.key}>{'"focus"'}</span>
          <span className={styles.comment}>: </span>
          <span className={styles.str}>{`"${j.focus}"`}</span>
          <span className={styles.comment}>,</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.indent} />
          <span className={styles.key}>{'"experience"'}</span>
          <span className={styles.comment}>: </span>
          <span className={styles.val}>{`"${j.experience}"`}</span>
          <span className={styles.comment}>,</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.indent} />
          <span className={styles.key}>{'"stack"'}</span>
          <span className={styles.comment}>: [</span>
          {j.stack.map((s, i) => (
            <span key={s}>
              <span className={styles.str}>{`"${s}"`}</span>
              {i < j.stack.length - 1 && (
                <span className={styles.comment}>, </span>
              )}
            </span>
          ))}
          <span className={styles.comment}>],</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.indent} />
          <span className={styles.key}>{'"status"'}</span>
          <span className={styles.comment}>: </span>
          <span className={styles.output}>{`"${j.status}"`}</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.comment}>{'}'}</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.prompt}>➜ </span>
          <span className={styles.termCursor} />
        </div>
      </div>
    </div>
  )
}
