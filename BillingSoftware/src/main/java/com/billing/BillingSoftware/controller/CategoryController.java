package com.billing.BillingSoftware.controller;

import com.billing.BillingSoftware.dto.CategoryRequest;
import com.billing.BillingSoftware.dto.CategoryResponse;
import com.billing.BillingSoftware.repository.CategoryRepository;
import com.billing.BillingSoftware.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.thirdparty.jackson.core.JsonProcessingException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString, @RequestPart("file") MultipartFile file) {

        ObjectMapper mapper = new ObjectMapper();
        CategoryRequest categoryRequest = mapper.readValue(categoryString, CategoryRequest.class);
        return categoryService.addCategory(categoryRequest, file);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> getAllCategories() {

        return categoryService.getAllCategories();
    }

    @DeleteMapping("admin/categories/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable String categoryId) {

        try {

            categoryService.DeleteCategory(categoryId);

        } catch (Exception e) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + categoryId);
        }
    }
}
