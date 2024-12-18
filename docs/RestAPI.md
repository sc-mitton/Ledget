## Versioning

The api routes have the version specified. As breaking changes are released, they'll be released
on the version after the lowest supported version by the front end. For example, if a path is renamed from /account to /financial-account, and the lowest supported version of the front end is v1, then this change will be released to v2. At this point, the backend's version is still 1, but it will have v2 routes available. The front end will update to the latest version, and then only after this will the backend version be incremented to v2, making the /v1 path unavailable. Simultaneously at this point, the paths in aws api gateway will have the old version routes removed.
