/**
 * Reusable Query Features Utility
 * Implements Searching, Filtering, Sorting, and Pagination for Mongoose models
 */
class QueryFeatures {
  constructor(mongooseQuery, queryString = {}) {
    this.query = mongooseQuery;
    this.queryString = queryString;
    this.page = 1;
    this.limit = 10;
  }

  /**
   * Keyword Search across specified model fields using case-insensitive regex
   * @param {string[]} searchableFields - Array of field names to search across
   */
  search(searchableFields = []) {
    const keyword = this.queryString.search || this.queryString.q;
    if (keyword && keyword.trim() && searchableFields.length > 0) {
      const searchRegex = new RegExp(keyword.trim(), 'i');
      const searchConditions = searchableFields.map((field) => ({
        [field]: searchRegex,
      }));
      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  /**
   * Filter query attributes with comparison operator support: [gte, gt, lte, lt, ne, in]
   * e.g. /records?attendancePercentage[gte]=90&class=10
   */
  filter(excludedFields = ['page', 'limit', 'sort', 'sortBy', 'search', 'q', 'fields']) {
    const queryObj = { ...this.queryString };
    excludedFields.forEach((key) => delete queryObj[key]);

    // Convert operators: gte, gt, lte, lt to $gte, $gt, etc.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in)\b/g, (match) => `$${match}`);
    const parsedFilter = JSON.parse(queryStr);

    this.query = this.query.find(parsedFilter);
    return this;
  }

  /**
   * Sort results by specified field(s)
   * e.g. /records?sort=-attendancePercentage or /records?sortBy=fullName:asc
   */
  sort(defaultSort = '-createdAt') {
    const sortParam = this.queryString.sortBy || this.queryString.sort;
    if (sortParam) {
      const sortFields = sortParam
        .split(',')
        .map((field) => {
          if (field.includes(':')) {
            const [f, order] = field.split(':');
            return order.toLowerCase() === 'desc' ? `-${f.trim()}` : f.trim();
          }
          return field.trim();
        })
        .join(' ');
      this.query = this.query.sort(sortFields);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  /**
   * Paginate query with page and limit
   */
  paginate(defaultLimit = 10, maxLimit = 100) {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    let limit = parseInt(this.queryString.limit, 10) || defaultLimit;
    limit = Math.min(Math.max(1, limit), maxLimit);
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  /**
   * Executes the query and returns records with pagination metadata
   */
  async execute() {
    const filterConditions = this.query.getFilter();
    const countPromise = this.query.model.countDocuments(filterConditions);
    const recordsPromise = this.query;

    const [records, totalRecords] = await Promise.all([recordsPromise, countPromise]);
    const totalPages = Math.ceil(totalRecords / this.limit) || 1;

    return {
      records,
      pagination: {
        totalRecords,
        currentPage: this.page,
        totalPages,
        limit: this.limit,
        hasNextPage: this.page < totalPages,
        hasPrevPage: this.page > 1,
      },
    };
  }
}

module.exports = QueryFeatures;
