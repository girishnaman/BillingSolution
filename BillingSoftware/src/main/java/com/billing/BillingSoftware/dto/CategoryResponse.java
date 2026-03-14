package com.billing.BillingSoftware.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Builder
@Data
public class CategoryResponse {

    private String categoryId;
    private String name;
    private String description;
    private String bgColor;
    private Timestamp createdDate;
    private Timestamp updatedDate;
    private String imgUrl;
    private Integer items;
}
