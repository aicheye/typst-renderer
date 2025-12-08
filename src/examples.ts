// Simple list of example Typst expressions used by the examples gallery.
export const examples: string[] = [
  "r = frac(Sigma(x_i - overline(x))(y_i - overline(y)), sqrt(Sigma(x_i - overline(x))^2Sigma(y_i - overline(y))^2))",
  "integral_0^infinity (e^x-e^(-x))/2 d x",
  "lim_(x -> 2^+) [x^3 + 2x]",
  "sum_(i=1)^n i",
  "sqrt(x^2 + y^2)",
  "forall x in RR: e^(i pi) + 1 = 0",
  "\"let\" A in M_(10 times 10) =mat(1, 2, ..., 10; 2, 2, ..., 10; dots.v, dots.v, dots.down, dots.v; 10, 10, ..., 10; )",
  "partial_x^2 u + partial_y^2 u = (1/c^2) partial_t^2 u",
  "nabla times E = -partial_t B",
  "det mat(a, b; c, d) = a d - b c",
  "f(x) = cases( x^2 \"if\" x < 0, sqrt(x) \"if\" x >= 0 )",
  "vec(x, y, z) = x hat(i) + y hat(j) + z hat(k)",
  "P(A | B) = P(B | A) P(A) / P(B)",
  "e^x = sum_(n=0)^infinity x^n / n!",
  "d/(d x) (u v) = u (d v)/(d x) + v (d u)/(d x)",
  "F(x) = integral_(-infinity)^x f(t) d t",
];

export default examples;
