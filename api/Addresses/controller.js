import Address from './model.js';
import { Ok, InternalServerError } from '../../helpers/server-response.js';

const result = (total) => (total ? 'successfully' : 'not');

export const createAddress = async (req, res) => {
  try {
    const address = await new Address().create(req.body);

    const message = 'Address successfully created';
    return Ok(res, message, address);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

export const getAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await new Address().findOne({ id });

    const message = `Address ${result(address)} found`;
    return Ok(res, message, address);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

export const getAddresses = async (req, res) => {
  try {
    let { page = 1, limit = 10, ...filters } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    const addressModel = new Address();

    const [addresses, total] = await Promise.all([
      addressModel.find({ ...filters, limit, offset }),
      addressModel.count(filters)
    ]);

    const totalPages = Math.ceil(total / limit);
    const message = `Addresses ${result(addresses.length)} found`;

    return Ok(res, message, {
      page,
      limit,
      total,
      totalPages,
      addresses: addresses
    });
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await new Address(id).update(req.body);

    const message = `Address ${result(address)} updated`;
    return Ok(res, message, address);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await new Address(id).update({ is_deleted: true });

    return Ok(res, `Address ${result(address)} deleted`, address);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};
