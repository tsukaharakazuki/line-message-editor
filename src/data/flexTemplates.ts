import type { FlexContainer } from '../types/line'

export interface FlexTemplate {
  id: string
  name: string
  category: 'basic' | 'commerce' | 'travel' | 'lifestyle' | 'info'
  description: string
  contents: FlexContainer
}

export const FLEX_TEMPLATE_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'basic', label: 'Basic' },
  { key: 'commerce', label: 'Commerce' },
  { key: 'travel', label: 'Travel' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'info', label: 'Info' },
]

export const FLEX_TEMPLATES: FlexTemplate[] = [
  // === Basic ===
  {
    id: 'simple-bubble',
    name: 'Simple Bubble',
    category: 'basic',
    description: 'Basic text message',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Hello, World!', weight: 'bold', size: 'xl' },
          { type: 'text', text: 'This is a Flex Message', size: 'sm', color: '#999999', margin: 'md' },
        ],
      },
    },
  },
  {
    id: 'with-image',
    name: 'With Image',
    category: 'basic',
    description: 'Hero image + text + button',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Brown Cafe', weight: 'bold', size: 'xl' },
          { type: 'text', text: 'A cozy place for coffee lovers', size: 'sm', color: '#999999', margin: 'md', wrap: true },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Visit', uri: 'https://example.com' }, style: 'primary' },
        ],
      },
    },
  },

  // === Commerce ===
  {
    id: 'shopping',
    name: 'Shopping',
    category: 'commerce',
    description: 'Product card with price',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Product Name', weight: 'bold', size: 'xl' },
          {
            type: 'box', layout: 'horizontal', margin: 'md', contents: [
              { type: 'text', text: '$29.99', size: 'xl', weight: 'bold', color: '#EE4D2D' },
              { type: 'text', text: '$49.99', size: 'sm', color: '#AAAAAA', gravity: 'bottom', decoration: 'line-through' },
            ],
          },
          { type: 'text', text: 'Limited time offer!', size: 'xs', color: '#999999', margin: 'md' },
        ],
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        spacing: 'sm',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Buy Now', uri: 'https://example.com' }, style: 'primary', color: '#EE4D2D' },
          { type: 'button', action: { type: 'uri', label: 'Details', uri: 'https://example.com' }, style: 'secondary' },
        ],
      },
    },
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant',
    category: 'commerce',
    description: 'Restaurant with rating & info',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Brown Cafe', weight: 'bold', size: 'xl' },
          {
            type: 'box', layout: 'baseline', margin: 'md', contents: [
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gray_star_28.png' },
              { type: 'text', text: '4.0', size: 'sm', color: '#999999', margin: 'md' },
            ],
          },
          {
            type: 'box', layout: 'vertical', margin: 'lg', spacing: 'sm', contents: [
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Place', color: '#AAAAAA', size: 'sm', flex: 1 },
                  { type: 'text', text: 'Shinjuku, Tokyo', wrap: true, color: '#666666', size: 'sm', flex: 5 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Time', color: '#AAAAAA', size: 'sm', flex: 1 },
                  { type: 'text', text: '10:00 - 23:00', wrap: true, color: '#666666', size: 'sm', flex: 5 },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Call', uri: 'tel:+81312345678' }, style: 'primary' },
          { type: 'button', action: { type: 'uri', label: 'Website', uri: 'https://example.com' }, style: 'link' },
        ],
      },
    },
  },
  {
    id: 'receipt',
    name: 'Receipt',
    category: 'commerce',
    description: 'Order receipt with items',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'RECEIPT', weight: 'bold', color: '#1DB446', size: 'sm' },
          { type: 'text', text: 'Brown Store', weight: 'bold', size: 'xxl', margin: 'md' },
          { type: 'text', text: 'Miraina Tower, 4-1-6 Shinjuku, Tokyo', size: 'xs', color: '#AAAAAA', wrap: true },
          { type: 'separator', margin: 'xxl' },
          {
            type: 'box', layout: 'vertical', margin: 'xxl', spacing: 'sm', contents: [
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Energy Drink', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: '$2.99', size: 'sm', color: '#111111', align: 'end' },
                ],
              },
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Chiffon Cake', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: '$3.50', size: 'sm', color: '#111111', align: 'end' },
                ],
              },
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Coffee Latte', size: 'sm', color: '#555555', flex: 0 },
                  { type: 'text', text: '$4.50', size: 'sm', color: '#111111', align: 'end' },
                ],
              },
              { type: 'separator', margin: 'xxl' },
              {
                type: 'box', layout: 'horizontal', margin: 'xxl', contents: [
                  { type: 'text', text: 'TOTAL', size: 'sm', weight: 'bold' },
                  { type: 'text', text: '$10.99', size: 'sm', weight: 'bold', align: 'end' },
                ],
              },
            ],
          },
        ],
      },
      styles: {
        footer: { separator: true },
      },
    },
  },

  // === Travel ===
  {
    id: 'hotel-booking',
    name: 'Hotel Booking',
    category: 'travel',
    description: 'Hotel with check-in/out dates',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://developers-resource.landpress.line.me/fx/img/01_3_movie.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Grand Palace Hotel', weight: 'bold', size: 'xl' },
          {
            type: 'box', layout: 'baseline', margin: 'md', contents: [
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'icon', size: 'sm', url: 'https://developers-resource.landpress.line.me/fx/img/review_gold_star_28.png' },
              { type: 'text', text: '5.0', size: 'sm', color: '#999999', margin: 'md' },
            ],
          },
          { type: 'separator', margin: 'lg' },
          {
            type: 'box', layout: 'vertical', margin: 'lg', spacing: 'sm', contents: [
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Check-in', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Mar 20, 2026', size: 'sm', color: '#666666', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Check-out', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Mar 23, 2026', size: 'sm', color: '#666666', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Total', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: '$450.00', size: 'lg', weight: 'bold', color: '#EE4D2D', flex: 4 },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        spacing: 'sm',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Book Now', uri: 'https://example.com' }, style: 'primary' },
          { type: 'button', action: { type: 'uri', label: 'More Info', uri: 'https://example.com' }, style: 'secondary' },
        ],
      },
    },
  },
  {
    id: 'transit-pass',
    name: 'Transit Pass',
    category: 'travel',
    description: 'Boarding pass with route info',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box', layout: 'horizontal', contents: [
              { type: 'text', text: 'BOARDING PASS', color: '#ffffff', size: 'sm', weight: 'bold' },
            ],
          },
          {
            type: 'box', layout: 'horizontal', margin: 'lg', contents: [
              { type: 'text', text: 'TYO', size: '3xl', weight: 'bold', color: '#ffffff' },
              {
                type: 'box', layout: 'vertical', flex: 2, contents: [
                  { type: 'filler' },
                  { type: 'text', text: '→', size: 'xl', color: '#ffffff', align: 'center' },
                  { type: 'filler' },
                ],
              },
              { type: 'text', text: 'OSA', size: '3xl', weight: 'bold', color: '#ffffff', align: 'end' },
            ],
          },
          {
            type: 'box', layout: 'horizontal', contents: [
              { type: 'text', text: 'Tokyo', size: 'xs', color: '#ffffff' },
              { type: 'text', text: 'Osaka', size: 'xs', color: '#ffffff', align: 'end' },
            ],
          },
        ],
        paddingAll: '20px',
        backgroundColor: '#0367D3',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box', layout: 'vertical', spacing: 'sm', contents: [
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Date', size: 'sm', color: '#AAAAAA', flex: 2 },
                  { type: 'text', text: 'Mar 20, 2026', size: 'sm', color: '#333333', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Time', size: 'sm', color: '#AAAAAA', flex: 2 },
                  { type: 'text', text: '10:30 - 13:00', size: 'sm', color: '#333333', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Train', size: 'sm', color: '#AAAAAA', flex: 2 },
                  { type: 'text', text: 'Nozomi 123', size: 'sm', color: '#333333', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'horizontal', contents: [
                  { type: 'text', text: 'Seat', size: 'sm', color: '#AAAAAA', flex: 2 },
                  { type: 'text', text: 'Car 5 / Seat 12A', size: 'sm', color: '#333333', flex: 4 },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'View Ticket', uri: 'https://example.com' }, style: 'primary', color: '#0367D3' },
        ],
      },
      styles: {
        header: { backgroundColor: '#0367D3' },
      },
    },
  },

  // === Lifestyle ===
  {
    id: 'event-ticket',
    name: 'Event Ticket',
    category: 'lifestyle',
    description: 'Event poster with details',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://developers-resource.landpress.line.me/fx/img/01_3_movie.png',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Summer Music Festival', weight: 'bold', size: 'xl' },
          { type: 'text', text: 'Live concert with top artists', size: 'sm', color: '#999999', margin: 'sm', wrap: true },
          { type: 'separator', margin: 'lg' },
          {
            type: 'box', layout: 'vertical', margin: 'lg', spacing: 'sm', contents: [
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Date', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Aug 15, 2026 (Sat)', size: 'sm', color: '#666666', flex: 5 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Time', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: '16:00 - 22:00', size: 'sm', color: '#666666', flex: 5 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Venue', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Tokyo Dome', size: 'sm', color: '#666666', flex: 5 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Seat', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'S-Block Row 5 No.12', size: 'sm', color: '#666666', flex: 5 },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Add to Calendar', uri: 'https://example.com' }, style: 'primary', color: '#905C44' },
          { type: 'button', action: { type: 'uri', label: 'Share', uri: 'https://example.com' }, style: 'link' },
        ],
      },
    },
  },
  {
    id: 'appointment',
    name: 'Appointment',
    category: 'lifestyle',
    description: 'Booking confirmation',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Appointment Confirmed', weight: 'bold', size: 'lg', color: '#ffffff' },
          { type: 'text', text: 'Your booking has been confirmed', size: 'xs', color: '#ffffffcc', margin: 'sm' },
        ],
        paddingAll: '20px',
        backgroundColor: '#27ACB2',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box', layout: 'vertical', spacing: 'sm', contents: [
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Service', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Hair Cut & Color', size: 'sm', color: '#333333', flex: 4, weight: 'bold' },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Date', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Mar 25, 2026 (Wed)', size: 'sm', color: '#333333', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Time', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: '14:00 - 15:30', size: 'sm', color: '#333333', flex: 4 },
                ],
              },
              {
                type: 'box', layout: 'baseline', spacing: 'sm', contents: [
                  { type: 'text', text: 'Location', color: '#AAAAAA', size: 'sm', flex: 2 },
                  { type: 'text', text: 'Salon de Beaute, Shibuya', size: 'sm', color: '#333333', flex: 4, wrap: true },
                ],
              },
            ],
          },
          { type: 'separator', margin: 'xl' },
          { type: 'text', text: 'Please arrive 5 minutes early. Cancel at least 24h in advance.', size: 'xs', color: '#AAAAAA', wrap: true, margin: 'xl' },
        ],
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        spacing: 'sm',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Reschedule', uri: 'https://example.com' }, style: 'secondary' },
          { type: 'button', action: { type: 'uri', label: 'Cancel', uri: 'https://example.com' }, style: 'link', color: '#FF5551' },
        ],
      },
      styles: {
        header: { backgroundColor: '#27ACB2' },
      },
    },
  },

  // === Info ===
  {
    id: 'news-carousel',
    name: 'News Article',
    category: 'info',
    description: 'Carousel of news cards',
    contents: {
      type: 'carousel',
      contents: [
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: 'TECH', size: 'xs', color: '#0367D3', weight: 'bold' },
              { type: 'text', text: 'New AI Features Released for Developers', weight: 'bold', size: 'md', margin: 'sm', wrap: true },
              { type: 'text', text: 'Major updates bring powerful new tools for building smarter applications...', size: 'xs', color: '#999999', margin: 'md', wrap: true, maxLines: 3 },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'button', action: { type: 'uri', label: 'Read More', uri: 'https://example.com' }, style: 'link' },
            ],
          },
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://developers-resource.landpress.line.me/fx/img/01_3_movie.png',
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: 'BUSINESS', size: 'xs', color: '#EE4D2D', weight: 'bold' },
              { type: 'text', text: 'Q4 Earnings Exceed Market Expectations', weight: 'bold', size: 'md', margin: 'sm', wrap: true },
              { type: 'text', text: 'Strong growth in digital services drives record quarterly revenue...', size: 'xs', color: '#999999', margin: 'md', wrap: true, maxLines: 3 },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'button', action: { type: 'uri', label: 'Read More', uri: 'https://example.com' }, style: 'link' },
            ],
          },
        },
        {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png',
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: 'LIFESTYLE', size: 'xs', color: '#27ACB2', weight: 'bold' },
              { type: 'text', text: 'Top 10 Cafes to Visit This Spring', weight: 'bold', size: 'md', margin: 'sm', wrap: true },
              { type: 'text', text: 'Discover hidden gems and seasonal menus across the city...', size: 'xs', color: '#999999', margin: 'md', wrap: true, maxLines: 3 },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'button', action: { type: 'uri', label: 'Read More', uri: 'https://example.com' }, style: 'link' },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'notification',
    name: 'Notification',
    category: 'info',
    description: 'Simple notification card',
    contents: {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'Notification', weight: 'bold', size: 'md', color: '#0367D3' },
          { type: 'text', text: 'Your order #1234 has been shipped and will arrive in 2-3 business days.', size: 'sm', color: '#555555', margin: 'md', wrap: true },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'button', action: { type: 'uri', label: 'Track Order', uri: 'https://example.com' }, style: 'primary', color: '#0367D3', height: 'sm' },
        ],
      },
      styles: {
        body: { separator: true },
      },
    },
  },
]
