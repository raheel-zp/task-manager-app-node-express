export class ApiFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  search() {
    if (this.queryParams.keyword) {
      const keyword = {
        $or: [
          { name: { $regex: this.queryParams.keyword, $options: "i" } },
          { email: { $regex: this.queryParams.keyword, $options: "i" } },
        ],
      };
      this.query = this.query.find(keyword);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryParams };
    const excluded = ["keyword", "page", "limit", "sort"];
    excluded.forEach((el) => delete queryObj[el]);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const [field, order] = this.queryParams.sort.split(":");
      this.query = this.query.sort({ [field]: order === "desc" ? -1 : 1 });
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
