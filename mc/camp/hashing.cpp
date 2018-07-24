#include <bits/stdc++.h>

using namespace std;

typedef long long ll;
typedef unsigned long long ull;

const int MOD = 1e9 + 7;
const int MAXN = 2e5;

int P = max(257, rand());
int h[MAXN], deg[MAXN], n;

inline void build(const string &s) {
    h[0] = 0;
    deg[0] = 1;
    n = s.size();
    for (int i = 0; i < n; ++i) {
		h[i + 1] = ((h[i] * 1ll * P) % MOD + s[i]) % MOD;
		deg[i + 1] = (deg[i] * 1ll * P) % MOD;
	}
}

inline int substr(int i, int len) {
	return ((h[i + len] - (h[i] * 1ll * deg[len] % MOD)) + MOD) % MOD;
}

inline int lcp(int i, int j) {
    int L = 0, R = n - max(i, j);
    while (L < R) {
      int M = (L + R + 1) / 2;
      if (substr(i, M) == substr(j, M))
        L = M;
      else
        R = M - 1;
    }
    return L;
}

int main() {
	srand(time(0));
	string s, t;
	cin >> s >> t;

	build(s);
	int e = substr(0, s.size());
	build(t);

	for (int i = 0; i + s.size() <= t.size(); ++i) {
 		if (substr(i, s.size()) == e) cout << i + 1 << " ";
	}
	cout << endl;

	return 0;
}
