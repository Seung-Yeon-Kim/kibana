<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-plugins-expressions-server](./kibana-plugin-plugins-expressions-server.md) &gt; [ExecutionContext](./kibana-plugin-plugins-expressions-server.executioncontext.md) &gt; [getKibanaRequest](./kibana-plugin-plugins-expressions-server.executioncontext.getkibanarequest.md)

## ExecutionContext.getKibanaRequest property

Getter to retrieve the `KibanaRequest` object inside an expression function. Useful for functions which are running on the server and need to perform operations that are scoped to a specific user.

<b>Signature:</b>

```typescript
getKibanaRequest?: () => KibanaRequest;
```
