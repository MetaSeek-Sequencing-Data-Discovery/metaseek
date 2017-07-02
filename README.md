MetaSeek is a data discovery and analysis tool for genome sequencing data. Providing a rich front-end for exploration of metadata across a wide set of data repositories, use MetaSeek to find the right aggregation of sequences for your analysis, and then access the raw sequencing data.

To add sample data to the DB, unzip bootstrapData.zip into a folder named bootstrapData in the project root, and then read:

```python bootstrap.py```

To clear the local memcached cache during testing:

```echo 'flush_all' | nc localhost 11211```
