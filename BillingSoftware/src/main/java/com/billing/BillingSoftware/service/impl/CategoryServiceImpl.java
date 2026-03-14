package com.billing.BillingSoftware.service.impl;

import com.billing.BillingSoftware.dto.CategoryRequest;
import com.billing.BillingSoftware.dto.CategoryResponse;
import com.billing.BillingSoftware.entity.CategoryEntity;
import com.billing.BillingSoftware.repository.CategoryRepository;
import com.billing.BillingSoftware.repository.ItemRepository;
import com.billing.BillingSoftware.service.CategoryService;
import com.billing.BillingSoftware.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final FileUploadService  fileUploadService;
    private final ItemRepository itemRepository;

    @Override
    public CategoryResponse addCategory(CategoryRequest categoryRequest, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        CategoryEntity categoryEntity = convertToEntity(categoryRequest);
        categoryEntity.setImgUrl(imgUrl);
        categoryEntity = categoryRepository.save(categoryEntity);
        return convertToResponse(categoryEntity);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::convertToResponse).toList();
    }

    @Override
    public void DeleteCategory(String categoryId) {

        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: "  + categoryId));
        fileUploadService.deleteFile(existingCategory.getImgUrl());
        categoryRepository.delete(existingCategory);
    }

    private CategoryResponse convertToResponse(CategoryEntity categoryEntity) {

        Integer itemsCount = itemRepository.countByCategoryId(categoryEntity.getId());
        return CategoryResponse.builder()
                .categoryId(categoryEntity.getCategoryId())
                .name(categoryEntity.getName())
                .description(categoryEntity.getDescription())
                .bgColor(categoryEntity.getBgColor())
                .imgUrl(categoryEntity.getImgUrl())
                .createdDate(categoryEntity.getCreatedDate())
                .updatedDate(categoryEntity.getUpdatedDate())
                .items(itemsCount)
                .build();
    }

    private CategoryEntity convertToEntity(CategoryRequest categoryRequest) {

        return CategoryEntity.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .bgColor(categoryRequest.getBgColor())
                .build();
    }
}
