package com.billing.BillingSoftware.service;

import com.billing.BillingSoftware.dto.CategoryRequest;
import com.billing.BillingSoftware.dto.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {

    CategoryResponse addCategory(CategoryRequest categoryRequest, MultipartFile file);

    List<CategoryResponse> getAllCategories();

    void DeleteCategory(String categoryId);
}
