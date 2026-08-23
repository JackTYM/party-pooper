export interface TicketConfig {
  imageDataUrl: string
  price: number
  eventTitle: string
  ticketTitle: string
}

function usePersistedConfig(key: string, defaults: TicketConfig) {
  const config = useState<TicketConfig>(key, () => ({ ...defaults }))

  if (import.meta.client) {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        Object.assign(config.value, JSON.parse(stored))
      } catch {
        // ignore malformed stored config, keep defaults
      }
    }

    watch(config, (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    }, { deep: true })
  }

  return config
}

export function usePoshConfig() {
  return usePersistedConfig('partypooper:posh', {
    imageDataUrl: '',
    price: 0,
    eventTitle: 'WAVY WEDNESDAYS',
    ticketTitle: 'RSVP',
  })
}

export function usePlotsConfig() {
  return usePersistedConfig('partypooper:plots', {
    imageDataUrl: '',
    price: 0,
    eventTitle: 'Heaven or Los Angeles with Special Guest DJ Simon Raymonde of Cocteau Twins',
    ticketTitle: 'Open RSVP',
  })
}
