export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'thank-you' | 'appeal' | 'update' | 'event' | 'newsletter';
  includeDonateButton: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'TEMP-001',
    name: 'Donation Thank You',
    subject: 'Thank You for Your Generous Gift',
    body: `Dear {{donor_name}},

Thank you so much for your generous donation of {{donation_amount}} to {{organization_name}}. Your support makes a real difference in our community.

Because of donors like you, we are able to continue our mission and serve those who need it most. Your contribution will directly impact:

• Supporting families in need
• Providing essential services
• Building stronger communities

We are deeply grateful for your partnership and trust in our work.

With heartfelt thanks,
{{organization_name}} Team`,
    category: 'thank-you',
    includeDonateButton: false,
  },
  {
    id: 'TEMP-002',
    name: 'Year-End Appeal',
    subject: 'Make a Difference This Year - Your Gift Matters',
    body: `Dear {{donor_name}},

As we approach the end of the year, we reflect on all we've accomplished together at {{organization_name}}. Thanks to supporters like you, we've been able to make a meaningful impact.

{{media}}

This Year's Impact:
• Served over 500 families in need
• Provided 10,000+ hours of support
• Launched new community programs

As the year comes to a close, we need your help to finish strong. Your year-end gift will help us continue this vital work and start 2026 ready to serve even more people.

Will you consider making a tax-deductible donation before December 31st?

Every gift, no matter the size, makes a real difference.

Thank you for your continued support,
{{organization_name}} Team`,
    category: 'appeal',
    includeDonateButton: true,
  },
  {
    id: 'TEMP-003',
    name: 'Monthly Update Newsletter',
    subject: '{{organization_name}} Monthly Update - {{month}} {{year}}',
    body: `Dear {{donor_name}},

Happy {{month}}! We wanted to share some exciting updates from {{organization_name}}.

{{media}}

This Month's Highlights:
• Completed renovation of community center
• Welcomed 25 new volunteers
• Launched summer youth program

Upcoming Events:
• Community Appreciation Day - {{event_date}}
• Volunteer Training Session - {{event_date}}

Your continued support makes all of this possible. Thank you for being part of our community!

Stay connected with us on social media for more updates.

Best regards,
{{organization_name}} Team`,
    category: 'newsletter',
    includeDonateButton: true,
  },
  {
    id: 'TEMP-004',
    name: 'Event Invitation',
    subject: "You're Invited! {{event_name}}",
    body: `Dear {{donor_name}},

We're excited to invite you to our upcoming event!

EVENT: {{event_name}}
DATE: {{event_date}}
TIME: {{event_time}}
LOCATION: {{event_location}}

Join us for an evening of celebration, community, and inspiration. This event is our way of saying thank you to supporters like you who make our work possible.

The evening will include:
• Inspiring stories from the community
• Light refreshments
• Networking with fellow supporters
• Special recognition of our impact

Space is limited, so please RSVP by {{rsvp_date}}.

We hope to see you there!

Warmly,
{{organization_name}} Team`,
    category: 'event',
    includeDonateButton: false,
  },
  {
    id: 'TEMP-005',
    name: 'Impact Story Update',
    subject: 'See How Your Gift is Making a Difference',
    body: `Dear {{donor_name}},

We wanted to share a story that shows the real impact of your support.

{{media}}

[Share a specific story about someone helped by the organization]

This is just one example of how your generosity is changing lives. Because of donors like you, we can continue to serve our community with excellence and compassion.

Your investment in our mission is creating lasting change. Thank you for believing in this work.

If you'd like to continue supporting stories like this, consider making an additional gift today.

With gratitude,
{{organization_name}} Team`,
    category: 'update',
    includeDonateButton: true,
  },
  {
    id: 'TEMP-006',
    name: 'Emergency Appeal',
    subject: 'URGENT: We Need Your Help',
    body: `Dear {{donor_name}},

We're reaching out with an urgent need. [Describe the emergency or critical situation].

We need to raise ${'{{goal_amount}}'} by {{deadline}} to respond to this critical need.

How You Can Help:
• Make an immediate gift online
• Share this message with friends and family
• Keep those affected in your thoughts

Your quick response can make all the difference. Every donation, no matter the size, will help us meet this urgent need.

Thank you for your compassionate support in this critical time.

Urgently,
{{organization_name}} Team`,
    category: 'appeal',
    includeDonateButton: true,
  },
  {
    id: 'TEMP-007',
    name: 'Volunteer Appreciation',
    subject: 'Thank You for Your Service!',
    body: `Dear {{volunteer_name}},

We wanted to take a moment to express our deep gratitude for your volunteer service with {{organization_name}}.

Your dedication and time have made an incredible impact:
• Hours volunteered: {{total_hours}}
• Lives touched: Countless
• Difference made: Immeasurable

Volunteers like you are the heart of our organization. Your willingness to give your time and talents strengthens our community and enables us to fulfill our mission.

Thank you for being such an important part of our team!

With sincere appreciation,
{{organization_name}} Team`,
    category: 'thank-you',
    includeDonateButton: false,
  },
  {
    id: 'TEMP-008',
    name: 'Recurring Donor Welcome',
    subject: 'Welcome to Our Monthly Giving Community!',
    body: `Dear {{donor_name}},

Welcome to the {{organization_name}} Sustainer Circle!

Thank you for committing to a monthly gift of {{monthly_amount}}. As a sustaining donor, you provide the consistent, reliable support that allows us to plan ahead and maximize our impact.

As a Sustainer Circle member, you'll receive:
• Quarterly impact reports
• Exclusive updates from our leadership
• Priority event invitations
• Recognition in our annual report

Your monthly gift of {{monthly_amount}} will:
• Provide ongoing support to our programs
• Help us respond quickly to emerging needs
• Ensure sustainable operations

Thank you for making this long-term commitment to our mission!

Gratefully,
{{organization_name}} Team`,
    category: 'thank-you',
    includeDonateButton: false,
  },
];

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return emailTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: EmailTemplate['category']): EmailTemplate[] => {
  return emailTemplates.filter(template => template.category === category);
};
