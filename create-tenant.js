const { TenantServiceClient } = require('@google-cloud/talent');

async function createTenant() {
  const client = new TenantServiceClient();

  const projectId = 'hackhazards25';
  const parent = `projects/${projectId}`;

  const request = {
    parent,
    tenant: {
      externalId: 'default-tenant', // You can change this to any string
    },
  };

  const [tenant] = await client.createTenant(request);
  console.log('Created Tenant:', tenant);
}

createTenant().catch(console.error); 