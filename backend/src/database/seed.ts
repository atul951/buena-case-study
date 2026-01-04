import { DataSource } from 'typeorm';
import { PropertyManager } from './entities/property-manager.entity';
import { Accountant } from './entities/accountant.entity';

export async function seedDatabase(dataSource: DataSource) {
  const propertyManagerRepository = dataSource.getRepository(PropertyManager);
  const accountantRepository = dataSource.getRepository(Accountant);

  // Check if data already exists
  const existingManagers = await propertyManagerRepository.count();
  const existingAccountants = await accountantRepository.count();

  if (existingManagers === 0) {
    const managers = [
      { name: 'John Smith', email: 'john.smith@buena.com' },
      { name: 'Maria Garcia', email: 'maria.garcia@buena.com' },
      { name: 'Thomas Müller', email: 'thomas.muller@buena.com' },
    ];

    await propertyManagerRepository.save(managers);
    console.log('✓ Seeded property managers');
  }

  if (existingAccountants === 0) {
    const accountants = [
      { name: 'Accounting Firm A', email: 'contact@accounting-a.com' },
      { name: 'Accounting Firm B', email: 'contact@accounting-b.com' },
      { name: 'Tax Experts GmbH', email: 'info@taxexperts.de' },
    ];

    await accountantRepository.save(accountants);
    console.log('✓ Seeded accountants');
  }
}
