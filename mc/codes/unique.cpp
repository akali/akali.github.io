#include <bits/stdc++.h>

using namespace std;

int main() {
	vector <int> v = {1, 1, 3, 4, 1, 3, 1, 3, 4, 4, 5, 6, 2};
	sort(v.begin(), v.end()); // Before unique - array should be sorted
	// Usage: unique(a.begin(), a.end()) returns index of last unique element
	v.resize(unique(v.begin(), v.end()) - v.begin());
	int a[] = {1, 3, 4, 5, 6, 2, 3, 5, 1, 4, 3};
	int n = 11;
	sort(a, a + n);
	n = unique(a, a + n) - a;
	for (int i = 0; i < v.size(); ++i)
		cout << v[i] << " ";
	cout << endl;

	for (int i = 0; i < n; ++i)
		cout << a[i] << " ";
	cout << endl;

	return 0;
}

