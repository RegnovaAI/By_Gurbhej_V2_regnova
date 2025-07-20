export const auditTypes = ['SOC 1', 'SOC 2', 'SOX', 'PCI-DSS', 'HIPAA', 'GDPR', 'FedRAMP', 'ISO 27001'];

export const scopeOptions = {
  'SOC 2': [
    'Security',
    'Availability', 
    'Processing Integrity',
    'Confidentiality',
    'Privacy'
  ],
  'ISO 27001': [
    'A.5 Information Security Policies',
    'A.6 Organization of Information Security',
    'A.7 Human Resource Security',
    'A.8 Asset Management',
    'A.9 Access Control',
    'A.10 Cryptography',
    'A.11 Physical and Environmental Security',
    'A.12 Operations Security',
    'A.13 Communications Security',
    'A.14 System Acquisition, Development and Maintenance',
    'A.15 Supplier Relationships',
    'A.16 Information Security Incident Management',
    'A.17 Information Security Aspects of Business Continuity Management',
    'A.18 Compliance'
  ]
};