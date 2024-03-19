export class Flatened {
  static removeCircularReferences(
    obj: any,
    seen = new WeakSet(),
  ) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (seen.has(obj)) {
      return;
    }

    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.removeCircularReferences(item, seen),
      );
    }

    const newObj = {};
    for (const key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(
          obj,
          key,
        )
      ) {
        newObj[key] =
          this.removeCircularReferences(
            obj[key],
            seen,
          );
      }
    }

    return newObj;
  }
}
