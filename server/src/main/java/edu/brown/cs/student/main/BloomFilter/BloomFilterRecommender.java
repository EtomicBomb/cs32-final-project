package edu.brown.cs.student.main.BloomFilter;

import edu.brown.cs.student.main.BloomFilter.SimilarityMetrics.SimilarXNOR;
import edu.brown.cs.student.main.BloomFilter.SimilarityMetrics.SimilarityMetric;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * The BloomFilterRecommender stores functionality for getting a list of neighbors and returning
 * the IDs of those neighbors in a string format. This is used for the similar_bf command
 * when generating a list of k nearest neighbors to a student with given id.
 *
 */
public class BloomFilterRecommender {
  private final int numNeighbors;
  private final String id;
  private final BloomFilterMap bfMap;
  private final BFComparator bfComparator;
  private SimilarityMetric defaultSimilarityMetric = new SimilarXNOR();
  /**
   * The BloomFilterRecommender constructor takes in a number of neighbors, id, BloomFilterList,
   * and similarity metric.
   * @param numNeighbors integer, representing number of neighbors to find
   * @param id integer, representing ID of student we are finding neighbors for
   * @param bfMap represents database of filters for students
   * @param metric SimilarityMetric, represents the metric we are using to sort by similarity
   * @throws IllegalArgumentException numNeighbors is negative or student cannot be found via ID
   */
  public BloomFilterRecommender(int numNeighbors, String id, BloomFilterMap bfMap,
                                SimilarityMetric metric) throws IllegalArgumentException {
    if (numNeighbors < 0) {
      throw new IllegalArgumentException("number of neighbors to find should be non-negative"
          + "integer");
    }
    this.numNeighbors = numNeighbors;
    this.bfMap = bfMap;
    this.id = id;
    if (!bfMap.containsKey(id)) {
      throw new IllegalArgumentException("ID is invalid, could not find student "
          + "with given ID in database");
    }

    // If a similarity metric is provided, change the default metric for the list
    if (metric != null) {
      this.setDefaultMetric(metric);
    }
    this.bfComparator = new BFComparator(bfMap.get(id), defaultSimilarityMetric);
  }
  /**
   * Gets nearest k neighbors to student with given ID.
   * @return List of IDs representing the nearest neighbors.
   */
  public List<String> getNeighborIDs() {
    Map<String, BloomFilter> copy = bfMap.copyMap();
    copy.remove(id);
    List<Map.Entry<String, BloomFilter>> entries = new ArrayList<>(copy.entrySet());
    Collections.shuffle(entries);
    entries.sort((e1, e2) -> bfComparator.compare(e1.getValue(), e2.getValue()));
    return entries.stream().map(Map.Entry::getKey).limit(numNeighbors).collect(Collectors.toList());
  }

  /**
   * Uses list of Pairs generated by getNeighbors() to create a string of IDs that can be returned
   * and printed by REPL.
   *
   * @return String containing IDs for each of the neighbors/similar students
   *
   */
  public String nearestNeighborsString() {
    return String.join("\n", getNeighborIDs());
  }

  /**
   * Private method to change default metric if a metric argument is passed to constructor.
   * @param metric Similarity Metric, defines similarity between two bloom filters
   */
  private void setDefaultMetric(SimilarityMetric metric) {
    this.defaultSimilarityMetric = metric;
  }
}

