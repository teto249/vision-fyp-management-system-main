const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function manageDomain() {
  try {
    console.log('🔍 Checking domain status...\n');
    
    // First, let's get all your domains
    const domains = await resend.domains.list();
    console.log('📋 Your domains:');
    console.log('Raw response:', domains);
    
    if (domains && domains.data && Array.isArray(domains.data)) {
      domains.data.forEach(domain => {
        console.log(`- ${domain.name} (ID: ${domain.id}) - Status: ${domain.status}`);
      });
    } else {
      console.log('No domains found or unexpected response format');
    }
    
    // Try to create a new domain for testing
    console.log('\n🆕 Creating new domain...');
    try {
      const newDomain = await resend.domains.create({ 
        name: 'utmvision.project.com' 
      });
      console.log('✅ Domain created successfully!');
      console.log('Domain ID:', newDomain.id);
      console.log('Domain Name:', newDomain.name);
      console.log('Status:', newDomain.status);
      
      console.log('\n� Add these DNS records to your domain provider:');
      if (newDomain.records && Array.isArray(newDomain.records)) {
        newDomain.records.forEach((record, index) => {
          console.log(`\nRecord ${index + 1}:`);
          console.log(`Type: ${record.type}`);
          console.log(`Name: ${record.name}`);
          console.log(`Value: ${record.value}`);
          if (record.priority) console.log(`Priority: ${record.priority}`);
        });
      }
      
      console.log('\n⏰ After adding DNS records, wait 5-10 minutes then verify the domain');
      
    } catch (createError) {
      console.error('❌ Failed to create domain:', createError.message);
      
      // Domain might already exist, try to get it
      if (createError.message.includes('already exists') || createError.message.includes('conflict')) {
        console.log('\n📋 Domain already exists. Getting existing domains...');
        // Try to list domains again and show details
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the script
manageDomain();
