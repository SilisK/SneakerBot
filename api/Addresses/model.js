import knex from '../../db/index.js';

class AddressesModel {
  constructor(id) {
    this.tableName = 'addresses';
    this.id = id;
  }

  async create(data) {
    return knex(this.tableName)
      .insert(Object.assign(data))
      .returning('*')
      .then((rows) => rows[0]);
  }

  async find(data) {
    const { limit, offset, ...filters } = data;

    const query = knex(this.tableName)
      .where({ is_deleted: false, ...filters })
      .orderBy('created_at', 'desc');

    if (limit) query.limit(parseInt(limit, 10));
    if (offset) query.offset(parseInt(offset, 10));

    return query;
  }

  async count(filters = {}) {
    const [{ count }] = await knex(this.tableName)
      .where({ is_deleted: false, ...filters })
      .count('* as count');

    return parseInt(count, 10);
  }

  async findOne(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, ...data })
      .orderBy('created_at', 'desc')
      .first();
  }

  async update(data) {
    return knex(this.tableName)
      .where({ id: this.id })
      .update(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  async hardDelete() {
    return knex(this.tableName).where({ id: this.id }).del();
  }
}

export default AddressesModel;
