import { test } from '@playwright/test';

/**
 * Method decorator: runs a page-object method inside `test.step`, so the HTML report and traces
 * read as "CheckoutInfoPage.fillCustomer" instead of a wall of clicks and fills.
 *
 *   @step() async addToCart(name: string) { ... }
 *   @step('Sort by {0}') async sortBy(option: SortOption) { ... }       // {n} = nth argument
 *   @step('Add {0.name} to the cart') async addToCart(p: Product) { ... } // a property of it
 */
export function step(title?: string) {
  return function <This extends object, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    return function (this: This, ...args: Args): Promise<Return> {
      const name = title
        ? title.replace(/\{(\d+)((?:\.\w+)*)\}/g, (_, i: string, path: string) =>
            String(
              path
                .split('.')
                .filter(Boolean)
                .reduce<unknown>(
                  (v, key) => (v as Record<string, unknown>)?.[key],
                  args[Number(i)],
                ),
            ),
          )
        : `${this.constructor.name}.${String(context.name)}`;
      return test.step(name, () => target.call(this, ...args), { box: true });
    };
  };
}
